using WebAPI3.Enum;

namespace WebAPI3.BindingModel
{
    public class ResponseModel
    {
        public ResponseModel(ResponseCode responseCode, string responseMessage, object dateSet)
        {
            ResponseCode = responseCode;
            ResponseMesage = responseMessage;
            DateSet = dateSet;
        }
        public ResponseCode ResponseCode { get; set; }
        public string ResponseMesage { get; set; }
        public object DateSet { get; set; }
    }
}
