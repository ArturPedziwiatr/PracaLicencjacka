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
        //Połączenie z bazą i konfiguracją
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public UsersController(DataContext context, IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _context = context;
            _env = env;
        }
        //END

        //System logowania. Przyjmuje wartości (login/email) i password,
        //zwraca model ResponseModel(wartość czy się udało, wiadomość,model użytkownika) 
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
                            var response = new LoginBack(user.Id, user.FirstName,user.LastName,user.Pesel,user.Position,user.Sex,user.Email,user.PhotoFile,CreateToken(user));
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

        //Metoda dodaje użytkowników do bazy danych
        [HttpPost]
        public async Task<ResponseModel> PostUsers(UserDto model)
        {
            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            Teachers teachers = new Teachers();
            Users user = new Users();
            user.PhotoFile = model.PhotoFile;
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
            if (user.Position == "T")
            {
                user.Teacher = teachers.Id;
                teachers.Side = model.Side;
                teachers.Phone = model.Phone;
                teachers.Description = model.Description;
                teachers.Title = model.Title;
            }
            else user.Teacher = null;

            try
            {
                if (user.Position == "T")
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
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda dodaje zdjęcia do folderu serwera
        [HttpPost("saveFile")]
        public async Task<ResponseModel> SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + fileName;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zdjęcie zostało dodane", fileName));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda get zwraca listę użytkowników
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

        //Metoda get zwraca użytkownika o podannym identyfikatorze
        [HttpGet("{id}")]
        public async Task<ResponseModel> GetUsers(Guid id)
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

        //Metoda put przyjmuje id użytkownika oraz stare i nowe hasło, gdy stare 
        //hasło jest zgodne zostaje zmienione na nowe
        [HttpPut("changePassword/{id}")]
        public async Task<ResponseModel> ChangePassword(Guid id, [FromBody] ChangePasswordDto model)
        {
            var user = await _context.User.FindAsync(id);
            if (VerifyPasswordHash(model.OldPassword, user.PasswordHash, user.PasswordSalt))
            {
                CreatePasswordHash(model.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }
            else
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Podano błędne hasło", null));
            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Hasło zostało zmienione", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda put przyjmuje id użytkownika oraz nazwę zdjęcia,
        //oraz edytuje zdjęcie profilowe
        [HttpPut("changePhoto/{id}/{name}")]
        public async Task<ResponseModel> ChangePhoto(Guid id, string name)
        {
            var user = await _context.User.FindAsync(id);
            if (user != null)
            {
                user.PhotoFile = name;
            }
            else
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono użytkownika", null));
            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zdjęcie zostało zmienione", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }


        //Metoda przyjmuje wartości danych możliwych do edytowania w modelu
        //użytkownik, oraz zamienia ich wartości
        [HttpPut("{id}")]
        public async Task<ResponseModel> PutUsers(Guid id, [FromBody] UserDto model)
        {
            var userUpdate = _context.User.FirstOrDefault(x => x.Id == id);
            if (userUpdate != null)
            {
                userUpdate.PhotoFile = model.PhotoFile;
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


        [HttpPut("basic/{id}")]
        public async Task<ResponseModel> PutBasicUsers(Guid id, [FromBody] UserBasic model)
        {
            var userUpdate = _context.User.FirstOrDefault(x => x.Id == id);
            if (userUpdate != null)
            {
                userUpdate.FirstName = model.FirstName;
                userUpdate.LastName = model.LastName;
                userUpdate.Sex = model.Sex;
                userUpdate.Email = model.Email;
            }
            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zaktualizowano użytkownika", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

            //Metoda put przyjmuje id użytkownika oraz nazwę zdjęcia,
            //oraz edytuje zdjęcie profilowe
            [HttpPut("admin/{id}")]
        public async Task<ResponseModel> ChangeAdmin(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            if (user != null)
            {
                user.isAdmin = !user.isAdmin;
            }
            else return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono użytkownika", null));
            
            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zdjęcie zostało zmienione", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda usuwa użytkowników z bazy danych
        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteUsers(Guid id)
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

        //Metoda sprawdzająca czy dany uzytkownik istnieje w bazie danych
        private bool UsersExists(Guid id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        //Funkcja tworzy hash do hasła
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        //Funkcja sprawdza czy podane hasło pasuje do hasła zapisanego w bazie danych
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return hash.SequenceEqual(passwordHash);
            }
        }

        //Funkcja tworzy token użytkownika, który wygasa po jednym dniu
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
