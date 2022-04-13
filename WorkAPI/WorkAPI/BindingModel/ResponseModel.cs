using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkAPI.Enum;

namespace WorkAPI.BindingModel
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
