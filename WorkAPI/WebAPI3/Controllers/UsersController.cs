#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using WebAPI.Models;
using WebAPI3.BindingModel;
using WebAPI3.Data;
using WebAPI3.Enum;
using WebAPI3.Models;

namespace WebAPI3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(DataContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ResponseModel> Login([FromBody] Logger model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = _context.User.Single(x => (x.Email == model.Login || x.Login == model.Login));
                    if (user != null)
                    {
                        if (VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
                        {
                            var response = new LoginBack(user.FirstName,user.LastName,user.Pesel,user.Position,user.Sex,user.Email,CreateToken(user));
                            return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Użytkownik zalogowany", response));
                        }
                        else
                            return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Błędne hasło", null));
                    }
                    else
                        return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Brak użytkownika", null));
               }
                else
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Błąd logowania", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet]
        public async Task<ResponseModel> GetUser()
        {
            try
            {
                var users = _context.User;
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", users));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("{id}")]
        public async Task<ResponseModel> GetUsers(int id)
        {
            var users = await _context.User.FindAsync(id);

            if (users == null)
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Brak użytkownika", null));

            try
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", users));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }

        }

        [HttpPut("{id}")]
        public async Task<ResponseModel> PutUsers(int id, [FromBody] UserDto model)
        {
           /* if(GuardDate(model))
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Niepoprawne dane", null));
           */
            var userUpdate = _context.User.FirstOrDefault(x => x.Id == id);
            if (userUpdate != null)
            {
                userUpdate.FirstName = model.FirstName;
                userUpdate.LastName = model.LastName;
                userUpdate.Pesel = model.Pesel;
                userUpdate.Sex = model.Sex;
                userUpdate.Email = model.Email;
                userUpdate.IdCard = model.IdCard;
                if (model.Password != "")
                {
                    CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
                    userUpdate.PasswordHash = passwordHash;
                    userUpdate.PasswordSalt = passwordSalt;
                }
            }
            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zaktualizowano użytkownika", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message , null));
            }
        }

        [HttpPost]
        public async Task<ResponseModel> PostUsers(UserDto model)
        {
            /*if (GuardDate(model))
               return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Błędne dane", null));*/
        

            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            Teachers teachers = new Teachers();
            Users user = new Users();
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;
                user.Pesel = model.Pesel;
                user.Position = model.Position;
                user.Sex = model.Sex;
                user.Login = model.Username;
                user.IdCard = model.IdCard;
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                if(user.Position == "T") user.Teacher = teachers.Id;
                 else user.Teacher = null;

            try
            {
                if(user.Position == "T")
                {
                    _context.Teacher.Add(teachers);
                    _context.User.Add(user);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Nauczyciel został dodany", null));
                }
                else
                {
                    _context.User.Add(user);
                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Student został dodany", null));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteUsers(int id)
        {
            var users = await _context.User.FindAsync(id);
            if (users == null)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Użtkownik nie został znaleziony", null));
            }

            try
            {
                _context.User.Remove(users);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Użtkownik został usunięty", null));
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        private bool UsersExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        //NotWorking
        private bool GuardDate(UserDto model)
        {
            if (CheckPesel(model.Email)) return true;
            if (StrongPassword(model.Password)) return true;
            else return false;
        }
        
        private bool CheckPesel(string p)
        {
            int control = 0;
            bool result = true;

            if (p.Length != 11) result = false;
            else
             for(var i=0; i<p.Length; i++) 
                if (!(p[i] >= '0' && p[i] <= '9')) result = false;

            control = 1 * Convert.ToInt32(new string(p[0], 1)) +
                      3 * Convert.ToInt32(new string(p[1], 1)) +
                      7 * Convert.ToInt32(new string(p[2], 1)) +
                      9 * Convert.ToInt32(new string(p[3], 1)) +
                      1 * Convert.ToInt32(new string(p[4], 1)) +
                      3 * Convert.ToInt32(new string(p[5], 1)) +
                      7 * Convert.ToInt32(new string(p[6], 1)) +
                      9 * Convert.ToInt32(new string(p[7], 1)) +
                      1 * Convert.ToInt32(new string(p[8], 1)) +
                      3 * Convert.ToInt32(new string(p[9], 1));
            control %= 10;
            control = 10 - control;
            control %= 10;
            if (control != Convert.ToInt32(new string(p[10], 1))) result = false;

            return result;
        }

        private bool StrongPassword(string p)
        {
            int big = 0;
            int litle = 0;
            int number = 0;

            if (p.Length < 6) return true;

            for (var i = 0; i < p.Length; i++)
            {
                if (p[i] >= 'a' && p[i] <= 'z') litle++;
                else if (p[i] >= 'A' && p[i] <= 'Z') big++;
                else if (p[i] >= '0' && p[i] <= '9') number++;
            }
            if (litle == 0 | big == 0 | number == 0) return true;              

            return false;
        }
        //END
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return hash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(Users user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Login)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
                );

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return jwtToken;
        }
    }
}
