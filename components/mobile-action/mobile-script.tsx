'use client';

import { useEffect, useRef } from 'react';

export function MobileActionScript() {
  const toolScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Define the configuration globally
    window.mobileAction = 'Yes';
    window.loadTool = {
      path: '/tb35e80da636/',
      outlink: 'https://vexlira.com/?s=84648&g=%C%',
      posX: 'right',
      playtype: 'random',
      anims: [
          {"id":"f0566_MelenaMariaRya_02","card":"f0566","model":"1093","posY":"bottom"},
          {"id":"e1306_MelenaMariaRya_04","card":"e1306","model":"1093","posY":"bottom"},
          {"id":"e1546_AgathaVega_nu","card":"e1546","model":"1374","posY":"bottom"},
          {"id":"e1746_AlissaFoxy_nu","card":"e1746","model":"1442","posY":"bottom"},
          {"id":"e1746_AlissaFoxy_nu2","card":"e1746","model":"1442","posY":"bottom"},
          {"id":"f0915_AlissaFoxy_01","card":"f0915","model":"1442","posY":"bottom"},
          {"id":"f1245_AlissaFoxy_hab","card":"f1245","model":"1442","posY":"bottom"},
          {"id":"e1317_AnastasiaBrokelyn_hab","card":"e1317","model":"1355","posY":"bottom"},
          {"id":"f0900_ChristyWhite_hab","card":"f0900","model":"1439","posY":"bottom"},
          {"id":"f0938_ChristyWhite_nu","card":"f0938","model":"1439","posY":"bottom"},
          {"id":"f0940_ChristyWhite_hab","card":"f0940","model":"1439","posY":"bottom"},
          {"id":"f0954_FreyaMayer_02","card":"f0954","model":"1423","posY":"bottom"},
          {"id":"e1011_HilaryC_hab","card":"e1011","model":"1233","posY":"bottom"},
          {"id":"f0608_JiaLissa_nu","card":"f0608","model":"1356","posY":"bottom"},
          {"id":"f1043_KellyCollins_01","card":"f1043","model":"1466","posY":"bottom"},
          {"id":"f1236_KellyCollins_02","card":"f1236","model":"1466","posY":"bottom"},
          {"id":"e1805_LanaLane_01","card":"e1805","model":"1443","posY":"bottom"},
          {"id":"e1805_LanaLane_02","card":"e1805","model":"1443","posY":"bottom"},
          {"id":"f1190_LaylaScarlett_02","card":"f1190","model":"1493","posY":"bottom"},
          {"id":"f0720_LittleCaprice_hab","card":"f0720","model":"870","posY":"bottom"},
          {"id":"e0762_MilaAzul_hab","card":"e0762","model":"1212","posY":"bottom"},
          {"id":"f0223_MilaAzul_nu","card":"f0223","model":"1212","posY":"bottom"},
          {"id":"f1182_MilenaRay_nu","card":"f1182","model":"1429","posY":"bottom"},
          {"id":"e1651_PaolaHard_02","card":"e1651","model":"1421","posY":"bottom"},
          {"id":"e1269_StellaCardo_hab","card":"e1269","model":"1345","posY":"bottom"},
          {"id":"e1270_StellaCardo_nu","card":"e1270","model":"1345","posY":"bottom"},
          {"id":"f0551_StellaCardo_hab","card":"f0551","model":"1345","posY":"bottom"},
          {"id":"f0910_Sybil_nu","card":"f0910","model":"1163","posY":"bottom"},
          {"id":"e1645_SonyaBlaze_ar_nonude","card":"e1645","model":"1427","posY":"bottom"},
          {"id":"f1112_SonyaBlaze_01","card":"f1112","model":"1427","posY":"bottom"},
          {"id":"f0946_SiaSiberia_03","card":"f0946","model":"1450","posY":"bottom"},
          {"id":"f0602_LiyaSilver_01","card":"f0602","model":"1327","posY":"bottom"},
          {"id":"f0913_AlissaFoxy_02","card":"f0913","model":"1442","posY":"bottom"},
          {"id":"e0086_ViolaBailey_02","card":"e0086","model":"967","posY":"bottom"},
          {"id":"e0114_SapphiraA_01","card":"e0114","model":"1106","posY":"bottom"},
          {"id":"e0450_GloriaSol_04","card":"e0450","model":"1169","posY":"bottom"},
          {"id":"e0454_GloriaSol_01","card":"e0454","model":"1169","posY":"bottom"}
      ]
    };

    // Create and append the tool script
    if (!toolScriptRef.current) {
      toolScriptRef.current = document.createElement('script');
      toolScriptRef.current.src = '/tb35e80da636.js';
      toolScriptRef.current.async = true;
      document.body.appendChild(toolScriptRef.current);
    }

    return () => {
      if (toolScriptRef.current) {
        document.body.removeChild(toolScriptRef.current);
        toolScriptRef.current = null;
      }
      // Clean up global variables
      delete window.mobileAction;
      delete window.loadTool;
    };
  }, []);

  return null;
}

// Add TypeScript declarations for global variables
declare global {
  interface Window {
    mobileAction?: string;
    loadTool?: {
      path: string;
      outlink: string;
      posX: string;
      playtype: string;
      anims: Array<{
        id: string;
        card: string;
        model: string;
        posY: string;
      }>;
    };
  }
}