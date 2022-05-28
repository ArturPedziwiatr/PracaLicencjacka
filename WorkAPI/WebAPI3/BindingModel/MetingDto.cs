
using System.ComponentModel.DataAnnotations;

namespace WebAPI3.BindingModel
{
    public class MetingDto
    {
        public MetingDto(string idTeacher, string title, string description
                        ,DateTime dateStart, DateTime dateEnd, bool isAccepted)
        {
            this.IdTeacher = idTeacher;
            this.Title = title;
            this.Description = description;
            this.DateStart = dateStart;
            this.DateEnd = dateEnd; 
            this.isAccepted = isAccepted;
        }
        public string IdTeacher { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }

        public bool isAccepted { get; set; }
    }
}
