using System.ComponentModel.DataAnnotations;

namespace WebAPI3.Models
{
    public class MeetConnector
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid IdStudent { get; set; }
        public Guid IdTeacher { get; set; }
        [Required]
        public Guid IdMessage { get; set; }

    }
}
