#nullable disable
namespace WebAPI3.BindingModel
{
    public class ConectorDto
    {
        public Guid IdTeacher { get; set; }
        public Guid IdMessage { get; set; }
        public Guid[] StudentIds { get; set; }
    }
}
