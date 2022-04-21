#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class TeachersController : ControllerBase
    {
        private readonly DataContext _context;

        public TeachersController(DataContext context)
        {
            _context = context;
        }

        
        [HttpGet("GetTeacher")]
        public async Task<ResponseModel> GetTeacher()
        {
            try
            {
                var user = (from u in _context.User
                            join t in _context.Teacher on u.Teacher equals t.Id
                           select new
                           {
                               u.Id,
                               u.FirstName,
                               u.LastName,
                               u.Email,
                               u.Sex,
                               u.Position,
                               u.IdCard,
                               t.Title,
                               t.Phone,
                               t.Description,
                               t.Side
                           }).AsEnumerable();

                user = user.Where(x => x.Position == "T");
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", user));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetStudent")]
        public async Task<ResponseModel> GetStudent()
        {
            try
            {
                var user = from s in _context.User select s;      
                user = user.Where(x => x.Position == "S");
                    
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", user));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        /*// GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teachers>> GetTeachers(int id)
        {
            var teachers = await _context.Teacher.FindAsync(id);

            if (teachers == null)
            {
                return NotFound();
            }

            return teachers;
        }

        // PUT: api/Teachers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeachers(int id, Teachers teachers)
        {
            if (id != teachers.Id)
            {
                return BadRequest();
            }

            _context.Entry(teachers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               /* if (!TeachersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        [HttpPost]
        public async Task<ResponseModel> PostTeachers(TeachersDto model)
        {
            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
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
            user.Teacher = model.Teachers;

            try
            {
                _context.User.Add(user);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Użtkownik został dodany", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeachers(int id)
        {
            var teachers = await _context.Teacher.FindAsync(id);
            if (teachers == null)
            {
                return NotFound();
            }

            _context.Teacher.Remove(teachers);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeachersExists(int id)
        {
            return _context.Teacher.Any(e => e.Id == id);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }*/
    }
}
