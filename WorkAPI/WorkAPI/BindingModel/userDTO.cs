using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkAPI.Controllers.BindingModel
{
    public class userDTO
    {
        public userDTO(string firstName, string lastName, string pesel, string position, string sex, string email)
        {
            FirstName = firstName;
            LastName = lastName;
            Pesel = pesel;
            Position = position;
            Sex = sex;
            Email = email;
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
