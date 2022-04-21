namespace WebAPI3.BindingModel
{
    public class PutMeeting
    {

        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
    }
}
