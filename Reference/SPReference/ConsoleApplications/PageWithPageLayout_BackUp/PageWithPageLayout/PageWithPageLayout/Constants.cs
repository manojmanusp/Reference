using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PageWithPageLayout
{
    public class Constants
    {
        public List<string> ZoneConfiguration()
        {
            List<string> zoneConfig = new List<string>();
            zoneConfig.Add("Zone1ID|Zone1Title");
            zoneConfig.Add("Zone2ID|Zone2Title");
            zoneConfig.Add("Zone3ID|Zone3Title");
            zoneConfig.Add("Zone4ID|Zone4Title");
            return zoneConfig;

        }
        
    }
}
