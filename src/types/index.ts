export type Page = {
	component: string;
	data: {
		title: string;
	};
};

export type Data = {
	pages: Record<string, Page>;
};
