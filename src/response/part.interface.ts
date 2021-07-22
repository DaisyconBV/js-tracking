import {PartStatusEnum} from 'src/response/part-status.enum';

export interface PartInterface {
	slab_id: string;
	ad_id: number;
	publisher_commission: number;
	media_id: number;
	status: PartStatusEnum;
	program_description: string;
	sku: string;
}
