import {PartInterface} from 'src/response/part.interface';
import {TrackingStatusEnum} from 'src/response/tracking-status.enum';

export interface SuccessInterface {
	affiliatemarketing_id?: string;
	parts?: PartInterface[];
	program_tag?: string;
	status: TrackingStatusEnum;
}
