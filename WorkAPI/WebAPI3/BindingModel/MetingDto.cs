
using System.ComponentModel.DataAnnotations;

namespace WebAPI3.BindingModel
{
    public class MetingDto
    {
        public MetingDto(int id, int idTeacher, int idStudent, string title, string description
                        ,DateTime dateStart, DateTime dateEnd, bool isAccepted)
        {
            this.Id = id;
            this.IdTeacher = idTeacher;
            this.IdStudent = idStudent;
            this.Title = title;
            this.Description = description;
            this.DateStart = dateStart;
            this.DateEnd = dateEnd; 
            this.isAccepted = isAccepted;
        }
        public int Id { get; set; }
        public int IdTeacher { get; set; }
        public int IdStudent { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }

        public bool isAccepted { get; set; }
    }
}
