namespace WebAPI3.BindingModel
{
    public class LoginBack
    {
        public LoginBack(string firstName, string lastName, string pesel, string position, string sex, string email, string token)
        {
            FirstName = firstName;
            LastName = lastName;
            Pesel = pesel;
            Position = position;
            Sex = sex;
            Email = email;
            Token = token;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Pesel { get; set; }
        public string Position { get; set; }
        public string Sex { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
