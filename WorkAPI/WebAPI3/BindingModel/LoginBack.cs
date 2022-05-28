using WebAPI3.Models;

namespace WebAPI3.BindingModel
{
    public class LoginBack
    {
        public LoginBack(Guid id, string firstName, string lastName, string pesel, string position, string sex, string email,string photoFile, string token, bool isAdmin)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Pesel = pesel;
            Position = position;
            Sex = sex;
            Email = email;
            PhotoFile = photoFile;
            Token = token;
            IsAdmin = isAdmin;
        }
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Pesel { get; set; }
        public string Position { get; set; }
        public string Sex { get; set; }
        public string Email { get; set; }
        public string PhotoFile { get; set; }
        public string Token { get; set; }
        public bool IsAdmin { get; set; }
    }
}
