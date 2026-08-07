export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareUrl(url: string, title: string): Promise<void> {
  if (navigator.share) {
    return navigator.share({ title, url });
  }
  return copyToClipboard(url);
}

export async function downloadElementAsPng(
  node: HTMLElement,
  filename: string
): Promise<void> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#f9faf9",
    cacheBust: true,
    filter: (domNode) => !(domNode instanceof HTMLElement && domNode.hasAttribute("data-nodownload")),
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}