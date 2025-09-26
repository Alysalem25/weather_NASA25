'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mountain, 
  Fish, 
  Waves, 
  TreePine, 
  Zap 
} from 'lucide-react';

const activities = [
  { value: 'hiking', label: 'Hiking', icon: Mountain },
  { value: 'fishing', label: 'Fishing', icon: Fish },
  { value: 'beach', label: 'Beach', icon: Waves },
  { value: 'picnic', label: 'Picnic', icon: TreePine },
  { value: 'sports', label: 'Sports', icon: Zap },
];

interface ActivityFilterProps {
  activity: string;
  onActivityChange: (activity: string) => void;
}

export default function ActivityFilter({ activity, onActivityChange }: ActivityFilterProps) {
  const currentActivity = activities.find(a => a.value === activity);

  return (
    <Select value={activity} onValueChange={onActivityChange}>
      <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentActivity && <currentActivity.icon className="w-4 h-4" />}
            {currentActivity?.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-white/20">
        {activities.map((item) => (
          <SelectItem key={item.value} value={item.value} className="text-white hover:bg-white/10">
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}