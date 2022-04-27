#nullable disable
namespace WebAPI3.BindingModel
{
    public class ConectorDto
    {
        public string IdTeacher { get; set; } = string.Empty;
        public string IdMessage { get; set; } = string.Empty;
        public int[] StudentIds { get; set; }
    }
}
