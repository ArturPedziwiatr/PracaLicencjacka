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
        private readonly DataContext _context;

        public MetingController(DataContext context)
        {
            _context = context;
        }

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

        [HttpGet("{id}/{position}")]
        public async Task<ResponseModel> GetMeting(string id, string position)
        {
            var connector = (from m in _context.Meting
                            join c in _context.Connectors on m.Id.ToString() equals c.IdMessage
                            select new { m.Id,c.IdTeacher,c.IdStudent,m.Title,m.Description,m.DateStart,m.DateEnd,m.isAccepted,m.isEnd}).ToList();
            if (position == "T")
            {
                connector = connector.Where(x => x.IdTeacher == id).ToList();

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
            else
            {
                connector = connector.Where(x => x.IdStudent == Int32.Parse(id)).ToList();

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
        }

        [HttpPut("{id}")]
        public async Task<ResponseModel> PutMeting(string id,[FromBody] PutMeeting model)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id.ToString() == id);
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
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Spotkanie zostało dodane", meting));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteMeting(Guid id)
        {
            var meet = await _context.Meting.FindAsync(id);
            var connector = _context.Connectors.Where(connector => connector.IdMessage == id.ToString()).ToList();
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

        [HttpPut("isAccepted/{id}")]
        public async Task<ResponseModel> ChangeIsAccepted(string id)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id.ToString() == id);
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

        [HttpPut("isEnd/{id}")]
        public async Task<ResponseModel> ChangeIsEnd(string id)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id.ToString() == id);
            if (meetUpdate != null)
                meetUpdate.isEnd = true;
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
