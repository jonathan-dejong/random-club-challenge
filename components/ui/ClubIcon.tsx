import * as React from "react";
import DriverIcon from "./DriverIcon";
import WoodIcon from "./WoodIcon";
import HybridIcon from "./HybridIcon";
import IronIcon from "./IronIcon";
import WedgeIcon from "./WedgeIcon";
import PutterIcon from "./PutterIcon";

interface ClubIconProps extends React.SVGProps<SVGSVGElement> {
  clubType?: string;
  iconName?: string;
}

const ClubIcon = ({ clubType, iconName, ...props }: ClubIconProps) => {
  const getIconComponent = (type: string, icon: string) => {
    // First try to match by iconName
    if (icon) {
      switch (icon) {
        case "DriverIcon":
          return <DriverIcon {...props} />;
        case "WoodIcon":
          return <WoodIcon {...props} />;
        case "HybridIcon":
          return <HybridIcon {...props} />;
        case "IronIcon":
          return <IronIcon {...props} />;
        case "WedgeIcon":
          return <WedgeIcon {...props} />;
        case "PutterIcon":
          return <PutterIcon {...props} />;
      }
    }

    // Fallback to matching by club type name
    const typeLower = type.toLowerCase();
    if (typeLower.includes("driver")) {
      return <DriverIcon {...props} />;
    } else if (typeLower.includes("wood")) {
      return <WoodIcon {...props} />;
    } else if (typeLower.includes("hybrid")) {
      return <HybridIcon {...props} />;
    } else if (typeLower.includes("iron")) {
      return <IronIcon {...props} />;
    } else if (typeLower.includes("wedge")) {
      return <WedgeIcon {...props} />;
    } else if (typeLower.includes("putter")) {
      return <PutterIcon {...props} />;
    }

    // Default fallback
    return <IronIcon {...props} />;
  };

  return getIconComponent(clubType || "", iconName || "");
};

export default ClubIcon;
