using System.Collections.Generic;

namespace server.Models
{
    public class Folder
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public IEnumerable<Document> Documents { get; set; }
        public IEnumerable<Folder> Folders { get; set; }
    }
}