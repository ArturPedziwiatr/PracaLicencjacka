#nullable disable
using Microsoft.AspNetCore.Mvc;
using WebAPI3.BindingModel;
using WebAPI3.Data;
using WebAPI3.Enum;
using WebAPI3.Models;

namespace WebAPI3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectorController : ControllerBase
    {
        //Połączenie z bazą danych
        private readonly DataContext _context;

        public ConnectorController(DataContext context)
        {
            _context = context;
        }
        //END

        //Metoda zwraca listę połączeń między spotkaniem a użytkownikami
        [HttpGet]
        public async Task<ResponseModel> GetConnector()
        {
            try
            {
                var connector = _context.Connectors;
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", connector));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda dodaje połączenia między spotkaniem a użytkownikami do bazy danych
        [HttpPost]
        public async Task<ResponseModel> PostConector([FromBody] ConectorDto model)
        {
 
            var idStudents = model.StudentIds;
            try
            {
                foreach(Guid id in idStudents)
                {
                    MeetConnector connector = new MeetConnector();
                    connector.IdTeacher = model.IdTeacher;
                    connector.IdMessage = model.IdMessage;
                    connector.IdStudent = id;
                    _context.Connectors.Add(connector);
                    await _context.SaveChangesAsync();
                }             
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Spotkanie zostało dodane", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("S/{id}")]
        public async Task<ResponseModel> GetConnectorS(Guid id)
        {
            try
            {
                var connector = (from u in _context.User
                                 join c in _context.Connectors on u.Id equals c.IdStudent
                                 select new {c.IdMessage,u.FirstName, u.LastName, u.IdCard }).AsEnumerable();
                connector = connector.Where(x => x.IdMessage == id);

                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Spotkanie zostało odnalezione", connector));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
