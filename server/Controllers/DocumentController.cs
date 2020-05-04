using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using server.Extensions;
using server.Models;

namespace server.Web.Controllers
{
    [Route("api/[controller]")]
    public class DocumentController : Controller
    {
        private IWebHostEnvironment environment;

        public DocumentController(IWebHostEnvironment environment)
        {
            this.environment = environment;
        }

        [HttpGet("[action]")]
        public Folder GetBaseFolder() => environment.WebRootPath.GetFolder();

        [HttpPost("[action]")]
        public Folder GetFolder([FromBody]Folder folder) => folder.Path.GetFolder();

        [HttpPost("[action]")]
        public async Task<Document> GetDocument([FromBody]Document document) => await document.Path.GetDocument();
    }
}