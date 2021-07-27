import {TrackingService} from 'src/tracking.service';

module.exports = (trackingDomain: string) => new TrackingService(trackingDomain);
