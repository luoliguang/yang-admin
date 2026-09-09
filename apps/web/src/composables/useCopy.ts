import { ref } from 'vue';
import { ElMessage } from 'element-plus';

/** 写剪贴板：优先 Clipboard API，非安全上下文/旧浏览器回退 execCommand */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 落到回退方案 */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * 复制并给出明显反馈：
 * - 成功：顶部 toast + 触发按钮的「已复制」态（copiedKey 记录是哪个按钮，1.6s 后复位）
 * - 失败：错误 toast
 */
export function useCopy() {
  const copiedKey = ref<string | null>(null);
  let timer: number | undefined;

  async function copy(text: string, opts: { tip?: string; key?: string } = {}) {
    const ok = await writeClipboard(text);
    if (ok) {
      ElMessage({ type: 'success', message: opts.tip ?? '已复制', duration: 2000, showClose: true, grouping: true });
      copiedKey.value = opts.key ?? '__default';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (copiedKey.value = null), 2500);
    } else {
      ElMessage.error('复制失败，请手动选中复制');
    }
    return ok;
  }

  const isCopied = (key = '__default') => copiedKey.value === key;

  return { copiedKey, isCopied, copy };
}
