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
        private readonly DataContext _context;

        public ConnectorController(DataContext context)
        {
            _context = context;
        }

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

        [HttpPost]
        public async Task<ResponseModel> PostConector([FromBody] ConectorDto model)
        {
 
            Array idStudents = model.StudentIds;
            try
            {
                foreach(int id in idStudents)
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
    }
}
