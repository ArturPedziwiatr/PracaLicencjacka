using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using WebAPI3.Models;

namespace WebAPI.Models
{
    /*[Index(nameof(Email), IsUnique = true), Index(nameof(Pesel), IsUnique = true), Index(nameof(IdCard), IsUnique = true)]*/
    public class Users
    {
        
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(100)]
        [Required]
        public string PhotoFile { get; set; } = string.Empty;

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
        public Boolean isAdmin { get; set; } = false;
    }
}
