using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PageWithPageLayoutsAndWebparts
{
    public class Constants
    {
        public static List<string> ZoneConfiguration()
        {
            List<string> zoneConfig = new List<string>();
            zoneConfig.Add("webpartIDZone1|NationalBankofOman_Zone1CarouselWebpart");
            zoneConfig.Add("webpartIDZone2|NationalBankofOman_Zone2VideoWebpart");
            zoneConfig.Add("webpartIDZone3|NationalBankofOman_Zone3CarouselWebpart");
            zoneConfig.Add("webpartIDZone4|NationalBankofOman_Zone4CarouselWebpart");
            zoneConfig.Add("webpartIDZone5|NationalBankofOman_Zone5GuideCarouselWebpart");
            zoneConfig.Add("webpartIDZone6|NationalBankofOman_Zone6PageFooterWebpart");
            return zoneConfig;

        }        
    }
}
