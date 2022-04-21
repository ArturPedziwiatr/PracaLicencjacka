using WebAPI3.Models;

namespace WebAPI3.BindingModel
{
    public class TeachersDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Pesel { get; set; } = string.Empty;

        public string Position { get; set; } = string.Empty;

        public string IdCard { get; set; } = string.Empty;

        public string Sex { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public Teachers Teachers { get; set; }
    }
}
