namespace WebAPI3.BindingModel
{
    public class TeacherSetting
    {
        public TeacherSetting(Guid id, string firstName, string lastName, string position, string sex, string email, string photoFile,
            string idTeacher, string title, string description, string phone, string side)
        {
            Id = id;
            PhotoFile = photoFile;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Position = position;
            Sex = sex;
            IdTeacher=idTeacher;
            Title = title;
            Description = description;
            Phone = phone;
            Side = side;
        }
        public Guid Id { get; set; }
        public string PhotoFile { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Position { get; set; }

        public string Sex { get; set; }
        public string IdTeacher { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Phone { get; set; }
        public string Side { get; set; }
    }
}
