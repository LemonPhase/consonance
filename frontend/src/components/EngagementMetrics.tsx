import React from 'react';
import { EngagementMetrics as EngagementMetricsType } from '../types/index';

interface EngagementMetricsProps {
  metrics: EngagementMetricsType;
  imageUrl: string;
  imageAlt: string;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ 
  metrics, 
  imageUrl, 
  imageAlt 
}) => {
  const consensusPercentage = metrics.consensusLevel;

  return (
    <div className="w-full md:w-80 shrink-0">
      <div className="bg-surface-container-lowest p-1 rounded shadow-sm">
        <img 
          alt={imageAlt}
          className="w-full h-48 object-cover rounded-sm mb-4" 
          src={imageUrl}
        />
        <div className="px-4 pb-4">
          <h4 className="font-label text-xs font-bold uppercase mb-3 text-outline">
            Engagement Metrics
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-label mb-1">
                <span>Consensus Level</span>
                <span className="text-secondary font-bold">{consensusPercentage}%</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full">
                <div 
                  className="bg-secondary h-full rounded-full" 
                  style={{ width: `${consensusPercentage}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-surface-container">
              <span className="font-label text-xs">Citations Verified</span>
              <span className="font-bold text-sm">{metrics.citationsVerified.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-surface-container">
              <span className="font-label text-xs">Active Debaters</span>
              <span className="font-bold text-sm">{metrics.activeDebaters.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
