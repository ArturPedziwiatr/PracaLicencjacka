#nullable disable
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI3.Models;
using WorkAPI.Model;

namespace WebAPI3.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Users> User { get; set; }

        public DbSet<Teachers> Teacher { get; set; }

        public DbSet<Metings> Meting { get; set; }

        public DbSet<MeetConnector> Connectors { get; set; }
    }
}
