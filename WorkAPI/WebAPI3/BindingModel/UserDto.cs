namespace WebAPI3.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string PhotoFile { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Pesel { get; set; } = string.Empty;

        public string Position { get; set; } = string.Empty;

        public string IdCard { get; set; } = string.Empty;

        public string Sex { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Side { get; set; } = string.Empty;

    }
}
