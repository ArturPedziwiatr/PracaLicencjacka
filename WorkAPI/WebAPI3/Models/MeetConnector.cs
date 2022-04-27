using System.ComponentModel.DataAnnotations;

namespace WebAPI3.Models
{
    public class MeetConnector
    {
        [Key]
        public int Id { get; set; }
        public int IdStudent { get; set; }
        public string IdTeacher { get; set; }
        [Required]
        public string IdMessage { get; set; }

    }
}
