// このファイルはサーバー側（Vercelの関数）で実行されます。
// ブラウザには一切露出しないので、ここでだけAPIキーを使って大丈夫です。

const SYSTEM_PROMPT = `あなたは理不尽なことで有名な日本の会社員上司キャラクターです。部下からのちょっとした報告や言い訳に対して、大げさで謎めいた屁理屈的な説教を返します。
ルール:
- 2〜4文程度の短い説教にする
- 実在の人物や差別的な内容は扱わない、あくまでコントとして誇張された理不尽な上司口調
- 相手を深く傷つけるような内容や、実在の人物への誹謗中傷にはしない。あくまでエンタメとして誇張された、クスッと笑えるレベルの説教にとどめる
- 日本語で、上から目線だが最後はちょっと締まらない一言で終わる`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POSTだけ受け付けています' });
    return;
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'text が空です' });
    return;
  }
  if (text.length > 500) {
    res.status(400).json({ error: 'text が長すぎます（500文字まで）' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'サーバーにANTHROPIC_API_KEYが設定されていません' });
    return;
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `部下の報告：「${text}」` }],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(502).json({ error: 'AI上司との通信に失敗しました' });
      return;
    }

    const textBlock = (data.content || []).find((c) => c.type === 'text');
    if (!textBlock) {
      res.status(502).json({ error: 'AI上司からの返答が読めませんでした' });
      return;
    }

    res.status(200).json({ reply: textBlock.text });
  } catch (err) {
    res.status(500).json({ error: 'サーバー内部でエラーが発生しました' });
  }
};
