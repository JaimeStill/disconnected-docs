using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Extensions
{
    public static class DocumentExtensions
    {
        public static Folder GetFolder(this string path, string pattern = "*.md")
        {
            if (Directory.Exists(path))
            {
                var directory = new DirectoryInfo(path);

                var folder = new Folder
                {
                    Name = directory.Name,
                    Path = directory.FullName,
                    Documents = directory.GetFiles(pattern)
                        .Select(x => new Document
                        {
                            Extension = x.Extension,
                            Name = x.Name,
                            Path = x.FullName
                        })
                };

                var folders = new List<Folder>();

                foreach (var dir in directory.GetDirectories())
                {
                    var sub = dir.FullName.GetFolder();

                    if ((sub.Documents != null && sub.Documents.Count() > 0) || (sub.Folders != null && sub.Folders.Count() > 0))
                    {
                        folders.Add(sub);
                    }
                }

                folder.Folders = folders.Count > 0 ? folders : null;

                return folder;
            }

            return null;
        }

        public static async Task<Document> GetDocument(this string path)
        {
            if (File.Exists(path))
            {
                var file = new FileInfo(path);

                return new Document
                {
                    Extension = file.Extension,
                    Name = file.Name,
                    Path = file.FullName,
                    Contents = await File.ReadAllTextAsync(path)
                };
            }

            return null;
        }
    }
}