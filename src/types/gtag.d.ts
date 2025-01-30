declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: string,
      eventName: string,
      eventParameters?: {
        [key: string]: any;
        event_category?: string;
        event_label?: string;
        value?: number;
        non_interaction?: boolean;
        page_path?: string;
        page_search?: string;
        send_page_view?: boolean;
        custom_map?: {
          [key: string]: string;
        };
      }
    ) => void;
  }
}

export interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}
