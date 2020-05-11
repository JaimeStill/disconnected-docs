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
        public Folder GetBaseFolder() => environment.WebRootPath.GetFolder(null);

        [HttpGet("[action]/{*path}")]
        public Folder GetFolder([FromRoute]string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return GetBaseFolder();
            }

            var crumb = path.GetDirectoryPath(false);
            path = $@"{environment.WebRootPath}\{path.Replace('/', '\\')}";
            return path.GetFolder(crumb.Split('/'), true);
        }

        [HttpGet("[action]/{*path}")]
        public async Task<Document> GetDocument([FromRoute]string path)
        {
            path = $@"{environment.WebRootPath}\{path.Replace('/', '\\')}";
            return await path.GetDocument();
        }
    }
}