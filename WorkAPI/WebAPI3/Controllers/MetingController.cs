#nullable disable
using Microsoft.AspNetCore.Mvc;
using WebAPI3.BindingModel;
using WebAPI3.Data;
using WebAPI3.Enum;
using WorkAPI.Model;

namespace WebAPI3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetingController : ControllerBase
    {
        //Połączenie z bazą danych
        private readonly DataContext _context;

        public MetingController(DataContext context)
        {
            _context = context;
        }
        //END

        //Metoda zwraca listę wszystkich utworzonych spotkań
        [HttpGet]
        public async Task<ResponseModel> GetMeting()
        {
            try
            {
                var metings = _context.Meting;
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", metings));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda zwraca listę wszystkich spotkań danego nauczyciela
        [HttpGet("T/{id}")]
        public async Task<ResponseModel> GetMetingT(Guid id)
        {
            var connector = (from m in _context.Meting
                                join c in _context.Connectors on m.Id equals c.IdMessage
                                select new { m.Id, c.IdTeacher, m.Title, m.Description, m.DateStart, m.DateEnd, m.isAccepted}).Distinct().AsEnumerable();
            connector = connector.Where(x => x.IdTeacher == id);
                 
            if (connector == null)
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono spotkań", null));

            try
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", connector));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda zwraca listę wszystkich spotkań danego studenta
        [HttpGet("S/{id}")]
        public async Task<ResponseModel> GetMetingS(Guid id)
        {
            var connector = (from m in _context.Meting
                             join c in _context.Connectors on m.Id equals c.IdMessage
                             select new { m.Id, c.IdTeacher, c.IdStudent, m.Title, m.Description, m.DateStart, m.DateEnd, m.isAccepted}).AsEnumerable();
            connector = connector.Where(x => x.IdStudent == id);

            if (connector == null)
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono spotkań", null));

            try
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", connector));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }

        }

        //Metoda edytuje spotkania w bazie danych
        [HttpPut("{id}")]
        public async Task<ResponseModel> PutMeting(Guid id,[FromBody] PutMeeting model)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id == id);
            if (meetUpdate != null)
            {
                meetUpdate.Title = model.Title;
                meetUpdate.Description = model.Description;
                meetUpdate.DateStart = model.DateStart;
                meetUpdate.DateEnd = model.DateEnd;
            }
            else
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono wydarzenia", null));

            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zaktualizowano spotkanie", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Metoda dodaje nowe spotkania do bazy danych
        [HttpPost]
        public async Task<ResponseModel> PostMeting([FromBody] MetingDto model)
        {

            Metings meting = new Metings();
            meting.Title = model.Title;
            meting.Description = model.Description;
            meting.DateStart = model.DateStart;
            meting.DateEnd = model.DateEnd;
            meting.isAccepted = (bool)model.isAccepted;

            try
            {
                _context.Meting.Add(meting);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Spotkanie zostało dodane", meting.Id.ToString()));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        //Usuwa spotkania z bazy danych
        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteMeting(Guid id)
        {
            Guid idNew = id;    
            var meet = await _context.Meting.FindAsync(idNew);
            var connector = _context.Connectors.Where(connector => connector.IdMessage == id).ToList();
            if (meet == null)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Wydarzenie nie zostało znalezione", null));
            }
            try
            {
                foreach (var obj in connector)
                {
                    _context.Connectors.Remove(obj);
                    await _context.SaveChangesAsync();
                }
                _context.Meting.Remove(meet);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Wydarzenie zostało usunięte", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }


        //Metoda zmienia status spotkania na aktywnyn/nieaktywny
        [HttpPut("isAccepted/{id}")]
        public async Task<ResponseModel> ChangeIsAccepted(Guid id, string accept)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id == id);
            if (meetUpdate != null)
                meetUpdate.isAccepted = !meetUpdate.isAccepted;
            else
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono wydarzenia", null));

            try
            {
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Zaktualizowano spotkanie", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
