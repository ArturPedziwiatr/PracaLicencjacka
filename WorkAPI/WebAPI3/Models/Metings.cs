using System.ComponentModel.DataAnnotations;

namespace WorkAPI.Model
{
    public class Metings 
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int IdTeacher { get; set; }
        [Required]
        public int IdStudent { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTime DateStart { get; set; }
        [Required]
        public DateTime DateEnd { get; set; }
        public Boolean isAccepted { get; set; } = false;
        public Boolean isEnd { get; set; } = false;
        
    }
}
