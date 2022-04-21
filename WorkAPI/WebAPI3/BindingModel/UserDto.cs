namespace WebAPI3.Models
{
    public class UserDto
    {

        /*[Column(TypeName = "nvarchar(100)")]
        public string PhotoFile { get; set; } = string.Empty;*/
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

    }
}
