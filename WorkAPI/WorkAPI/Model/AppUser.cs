using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;


namespace Claim.Data.Entities{

    public class AppUser:IdentityUser{
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string Pesel {get; set;}
        public string Position {get; set;}
        public string Sex {get; set;}
        public string IdCard { get; set; }
    }
}