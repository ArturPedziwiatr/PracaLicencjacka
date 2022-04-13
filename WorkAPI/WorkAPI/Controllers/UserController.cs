using Claim.BindingModel;
using Claim.Data.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WorkAPI.BindingModel;
using WorkAPI.Controllers.BindingModel;
using WorkAPI.Data;
using WorkAPI.Enum;

namespace WorkAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
    
        private readonly ILogger<UserController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signManager;
        private readonly JWTConfig _jWTConfig;
        public UserController(ILogger<UserController> logger, UserManager<AppUser> userManager, SignInManager<AppUser> signManager, IOptions<JWTConfig> jwtConfig)
        {
            _userManager = userManager;
            _signManager = signManager;
            _logger = logger;
            _jWTConfig = jwtConfig.Value;
        }

        [HttpPost("Register")]
       public async Task<object> Register([FromBody] AddRegisterBind model){
           try{
            var user = new AppUser()
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email,
                Pesel = model.Pesel,
                Position = model.Position,
                Sex = model.Sex,
                Email = model.Email,
                IdCard = model.IdCard
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.OK,"Użytkownik zarejestrowany",null));
            }
            return await Task.FromResult(new ResponseModel(ResponseCode.Error, "", result.Errors.Select(x=>x.Description).ToArray()));    
           }catch(Exception ex){
               return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
           }
       }

        [HttpPost("Login")]
        public async Task<ResponseModel> Login([FromBody] LoginBinding model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _signManager.PasswordSignInAsync(model.Email, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        var appUser = await _userManager.FindByEmailAsync(model.Email);
                        var user = new userDTO(appUser.FirstName, appUser.LastName, appUser.Pesel, appUser.Position, appUser.Sex, appUser.Email);
                        user.Token = GenerateToken(appUser);
                        
                        return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Użytkownik zalogowany", user));
                    }
                        
                }
                
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Błąd logowania", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetAllUsers")]
       public async Task<Object> GetAllUsers(){
           try{
               var users = _userManager.Users;
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", users));
            }
            catch(Exception ex){
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message , null));
            }
       }

        [HttpGet("GetUser")]
        public async Task<Object> GetUser(string key)
        {
            try
            {
                var users = _userManager.Users.Where(x => x.Id == key); 
                return await Task.FromResult(users);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<Object> updateUser(string id, [FromBody] AddRegisterBind model)
        {
            var userUpdate = _userManager.Users.FirstOrDefault(x => x.Id == id);
            if(userUpdate != null)
            {
                userUpdate.FirstName = model.FirstName;
                userUpdate.LastName = model.LastName;
                userUpdate.Pesel = model.Pesel;
                userUpdate.Sex = model.Sex;
                userUpdate.Email = model.Email;
                userUpdate.IdCard = model.IdCard;
                if (model.Password != "")
                {
                    userUpdate.PasswordHash = _userManager.PasswordHasher.HashPassword(userUpdate,model.Password);
                }   
            }
            try
            {
                var result = await _userManager.UpdateAsync(userUpdate);
                if (!result.Succeeded) return await Task.FromResult("false");
                else return await Task.FromResult("true");
            }
            catch (Exception ex)
            {
                return await Task.FromResult(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<Object> deleteUser(string id)
        {
            try
            {
                var remove = _userManager.Users.FirstOrDefault(x => x.Id == id);
                if (remove != null)
                {
                    var result = await _userManager.DeleteAsync(remove);
                    if (!result.Succeeded) return await Task.FromResult("false");
                    else return await Task.FromResult("true");
                }
                else return NotFound();
                
            }
            catch (Exception ex)
            {
                return await Task.FromResult(ex.Message);
            }
        }

        private string GenerateToken(AppUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jWTConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.NameId, user.Id),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.UniqueName, user.Position),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Gender, user.Sex),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }
}
