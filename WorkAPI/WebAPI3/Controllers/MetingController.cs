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
        public async Task<ResponseModel> GetMeting(int id, string position)
        {
            if(position == "T")
            {
                var metings = _context.Meting.Where(x => x.IdTeacher == id);

                if (metings == null)
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono spotkań", null));

                try
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", metings));
                }
                catch (Exception ex)
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
                }
            }
            else
            {
                var metings = _context.Meting.Where(x => x.IdStudent == id);

                if (metings == null)
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Nie znaleziono spotkań", null));

                try
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Ładowanie listy", metings));
                }
                catch (Exception ex)
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
                }
            }
        }

        [HttpPut("{id}")]
        public async Task<ResponseModel> PutMeting(int id, [FromBody] PutMeeting model)
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

        [HttpPost]
        public async Task<ResponseModel> PostMeting([FromBody] MetingDto model)
        {

            Metings meting = new Metings();
            meting.IdTeacher = model.IdTeacher;
            meting.IdStudent = model.IdStudent;
            meting.Title = model.Title;
            meting.Description = model.Description;
            meting.DateStart = model.DateStart;
            meting.DateEnd = model.DateEnd;
            meting.isAccepted = (bool)model.isAccepted;

            try
            {
                _context.Meting.Add(meting);
                await _context.SaveChangesAsync();
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "Spotkanie zostało dodane", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteMeting(int id)
        {
            var meet = await _context.Meting.FindAsync(id);
            if (meet == null)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Wydarzenie nie zostało znalezione", null));
            }

            try
            {
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
        public async Task<ResponseModel> ChangeIsAccepted(int id)
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

        [HttpPut("isEnd/{id}")]
        public async Task<ResponseModel> ChangeIsEnd(int id)
        {
            var meetUpdate = _context.Meting.FirstOrDefault(x => x.Id == id);
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
