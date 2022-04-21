using System.ComponentModel.DataAnnotations;
using WebAPI3.Models;

namespace WebAPI.Models
{
    public class Users
    {
        
        public int Id { get; set; }

        /*[Column(TypeName = "nvarchar(100)")]
        public string PhotoFile { get; set; } = string.Empty;*/

        [StringLength(50)]
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(50)]
        [Required]
        public string Email { get; set; } = string.Empty;

        [StringLength(11)]
        [Required]
        public string Pesel { get; set; } = string.Empty;

        [StringLength(1)]
        [Required]
        public string Position { get; set; } = string.Empty;

        [StringLength(1)]
        public string Sex { get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        [StringLength(50)]
        public string Login { get; set; } = string.Empty;

        [StringLength(7)]
        [Required]
        public string IdCard { get; set; }

        public Guid? Teacher { get; set; } 
    }
}
