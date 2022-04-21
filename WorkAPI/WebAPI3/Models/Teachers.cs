using System.ComponentModel.DataAnnotations;

namespace WebAPI3.Models
{
    public class Teachers
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(30)]
        public string Title { get; set; } = string.Empty;

        [StringLength(9)]
        public string Phone { get; set; } = string.Empty;
        [StringLength(50)]
        public string Side { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}
