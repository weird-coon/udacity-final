import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extends day plugin for compare trip planner dates
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);

export default dayjs;
