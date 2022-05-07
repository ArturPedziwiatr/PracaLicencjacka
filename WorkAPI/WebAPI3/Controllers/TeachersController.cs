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
        //Połączenie z bazą danych
        private readonly DataContext _context;

        public TeachersController(DataContext context)
        {
            _context = context;
        }
        //END
        
        //Metoda zwraca listę nauczycieli
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
                               u.PhotoFile,
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

        //Metoda zwraca listę studentów
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

        //Metoda przyjmuje wartości modelu Teacher i edytuje dane w bazie
        [HttpPut("{id}")]
        public async Task<ResponseModel> PutTeachers(Guid id, Teachers model)
        {
            var teacherUser = _context.Teacher.FirstOrDefault(x => x.Id == id);
            if (teacherUser != null)
            {
                teacherUser.Title = model.Title;
                teacherUser.Description = model.Description;
                teacherUser.Side = model.Side;
                teacherUser.Phone = model.Phone;
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

        //Metoda zwraca nauczyciela o podanym identyfikatorze
        [HttpGet("{id}")]
        public async Task<ResponseModel> GetTeachers(Guid id)
        {
            try
            {
                var user = await _context.User.FindAsync(id);
                var teacher = await _context.Teacher.FindAsync(user.Teacher); 
                var res = new TeacherSetting(user.Id, user.FirstName, user.LastName, user.Position, user.Sex, user.Email,
                    user.PhotoFile, teacher.Id.ToString(), teacher.Title, teacher.Description, teacher.Phone, teacher.Side);
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", res));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

    }
}
