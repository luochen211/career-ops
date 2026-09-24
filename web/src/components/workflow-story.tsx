"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, LockKeyhole, Pause, ShieldCheck, StopCircle, UserRoundCheck } from "lucide-react";
import "./workflow-story.css";

type Step = {
  kind: string;
  title: string;
  action: string;
  input: string;
  output: string;
  gate: string;
  pass: string;
  hold: string;
  source: string;
};

const steps: Step[] = [
  {
    kind: "输入", title: "从职位链接或职位描述开始",
    action: "读取职位描述；也可以从已配置的招聘门户扫描候选职位。外部页面只作为数据，不能向智能体下指令。",
    input: "职位链接 / 粘贴的职位描述 / 门户扫描结果", output: "可供核对的职位内容",
    gate: "来源边界", pass: "取得职位内容，进入有效性检查。", hold: "无法读取时，请求粘贴职位描述或提供截图。",
    source: "modes/auto-pipeline.md · Step 0",
  },
  {
    kind: "门禁 01", title: "确认职位仍在招聘",
    action: "从页面寻找职位标题、描述和申请入口；识别过期、404、空壳页或跳转到通用招聘页。",
    input: "职位页面快照", output: "有效 / 已关闭 / 无法核实",
    gate: "有效性门禁", pass: "确认仍开放，才继续评估。", hold: "已关闭则停止；只有粘贴的职位描述没有链接时，明确跳过链接核验。",
    source: "modes/auto-pipeline.md · Step 0.5",
  },
  {
    kind: "门禁 02", title: "尊重你的排除名单",
    action: "若你启用了 data/blacklist.md，先对照公司。命中时展示你记录的原因，再等你决定是否继续。",
    input: "公司名称 + 可选黑名单", output: "继续 / 暂停询问",
    gate: "黑名单门禁", pass: "未命中，或你明确同意覆盖后继续。", hold: "命中时暂停；没有明确同意就不评估。黑名单不改变评分。",
    source: "modes/auto-pipeline.md · Step 0.6",
  },
  {
    kind: "评估", title: "给出有依据的匹配判断",
    action: "对照你的简历和个人偏好，生成结构化报告。综合分数是 1–5；招聘真实性单独判断，不混入总分。",
    input: "职位内容 + 你的简历和个人资料", output: "报告、分数、招聘真实性判断",
    gate: "事实与评分边界", pass: "4.5+ 强匹配；4.0–4.4 值得投递；3.5–3.9 需要具体理由。",
    hold: "低于 3.5 建议不投；分数是建议，决定权仍在你。不得编造经历或成果。",
    source: "modes/_shared.md · Scoring System",
  },
  {
    kind: "产物", title: "把判断变成可复核的材料",
    action: "保存评估报告和原始职位描述；按配置生成定制简历。达到 4.5 分时，可额外起草申请表答案。",
    input: "已评估的职位 + 个人事实来源", output: "评估报告 · 定制简历 · 可选答案草稿",
    gate: "内容来源门禁", pass: "有来源的事实可以重组、强调和表达。",
    hold: "缺少依据的数字、作者身份或资格不能补写成事实；需要求职者确认。",
    source: "AGENTS.md · Source-of-Truth Boundary",
  },
  {
    kind: "门禁 03", title: "投递前重新核对",
    action: "核对表单对应的公司和职位是否仍正确、仍开放；检查黑名单、跨渠道重复投递和可能的筛选问题。",
    input: "实际申请表 + 已存报告 + 投递记录", output: "可填写答案 / 待确认问题",
    gate: "投递预检", pass: "确认无冲突后生成或填写答案。",
    hold: "职位不符、重复渠道或关键答案缺失时暂停，交由你处理。",
    source: "modes/apply.md · Step 5–6",
  },
  {
    kind: "交接", title: "你检查，并亲自提交",
    action: "网页可以预填表单并展示答案。你核对真实表单后，自己点击提交；确认已投递后，再更新追踪状态。",
    input: "已填写的申请表", output: "你的提交动作 + 投递记录",
    gate: "人工提交门禁", pass: "你确认已提交，状态才记为“已投递”。",
    hold: "智能体不会自动按下提交按钮，也不会把“已填写”当成“已投递”。",
    source: "web/AGENTS.md · Nothing is ever submitted automatically",
  },
];

export function WorkflowStory() {
  const [active, setActive] = useState(0);
  const [outcome, setOutcome] = useState<"pass" | "hold">("pass");
  const step = steps[active];

  function select(index: number) {
    setActive(index);
    setOutcome("pass");
  }

  return (
    <div className="workflow-page" lang="zh-CN">
      <section className="workflow-hero">
        <div className="workflow-hero-top"><span>CAREER-OPS / 运行地图</span><span>01 — 07</span></div>
        <div className="workflow-hero-main">
          <div>
            <p className="workflow-eyebrow"><span className="workflow-live-dot" /> 求职智能体 · 运行流程</p>
            <h1>每一步都看得见。<br /><em>每道门禁都说得清。</em></h1>
            <p className="workflow-lede">从发现职位到亲自投递，沿着真实工作流查看智能体做什么、产出什么，以及何时必须停下。</p>
            <a className="workflow-hero-link" href="#workflow-run">开始浏览流程 <ArrowDown size={18} /></a>
          </div>
          <div className="workflow-orbit" aria-hidden="true">
            <div className="workflow-orbit-ring workflow-ring-one" /><div className="workflow-orbit-ring workflow-ring-two" />
            <div className="workflow-orbit-center"><span>求职</span><strong>OPS</strong><small>发现 · 评估 · 准备</small></div>
            <span className="workflow-orbit-tag tag-a">来源</span><span className="workflow-orbit-tag tag-b">核验</span><span className="workflow-orbit-tag tag-c">人工</span>
          </div>
        </div>
        <div className="workflow-hero-foot"><span>本地文件为数据真源</span><span>演示页面 · 不执行求职操作</span><span>最终提交由你完成</span></div>
      </section>

      <section className="workflow-run" id="workflow-run">
        <div className="workflow-section-heading"><div><p className="workflow-kicker">运行过程 / 01—07</p><h2>沿着一次投递走完七步</h2></div><p>选择节点，再切换“通过 / 暂停”，看清每道门禁如何改变流程。</p></div>
        <div className="workflow-stage-grid">
          <nav className="workflow-rail" aria-label="运行步骤">
            {steps.map((item, index) => <button key={item.title} type="button" onClick={() => select(index)} aria-current={active === index ? "step" : undefined} className={"workflow-step " + (active === index ? "is-active" : "") + (index < active ? " is-past" : "")}><span className="workflow-step-number">{String(index + 1).padStart(2, "0")}</span><span><small>{item.kind}</small><strong>{item.title}</strong></span><ArrowRight size={17} /></button>)}
          </nav>
          <article className="workflow-detail" aria-live="polite">
            <div className="workflow-detail-overline"><span>第 {String(active + 1).padStart(2, "0")} 步 / 共 07 步</span><span>{step.kind}</span></div>
            <h3>{step.title}</h3><p className="workflow-action">{step.action}</p>
            <div className="workflow-io"><div><small>输入</small><p>{step.input}</p></div><ArrowRight size={20} aria-hidden="true" /><div><small>输出</small><p>{step.output}</p></div></div>
            <div className="workflow-gate"><div className="workflow-gate-title"><LockKeyhole size={17} /><span>{step.gate}</span></div><div className="workflow-outcome-tabs" role="group" aria-label="查看门禁结果"><button type="button" aria-pressed={outcome === "pass"} onClick={() => setOutcome("pass")}><Check size={14} /> 通过</button><button type="button" aria-pressed={outcome === "hold"} onClick={() => setOutcome("hold")}><Pause size={14} /> 暂停 / 停止</button></div><p className={"workflow-outcome " + outcome}>{outcome === "pass" ? step.pass : step.hold}</p></div>
            <div className="workflow-detail-footer"><span>依据：{step.source}</span><div><button type="button" aria-label="上一步" onClick={() => select(Math.max(0, active - 1))} disabled={active === 0}><ArrowLeft size={17} /></button><button type="button" aria-label="下一步" onClick={() => select(Math.min(steps.length - 1, active + 1))} disabled={active === steps.length - 1}><ArrowRight size={17} /></button></div></div>
          </article>
        </div>
      </section>

      <section className="workflow-principles"><p className="workflow-kicker">核心门禁 / 三条边界</p><h2>让自动化有边界</h2><div className="workflow-principle-list"><div><ShieldCheck /><span>01</span><h3>事实可追溯</h3><p>经历和数字来自你确认的资料；职位网页不能改写智能体规则。</p></div><div><StopCircle /><span>02</span><h3>异常会停下</h3><p>失效职位、黑名单命中、投递渠道冲突会在对应步骤拦住流程。</p></div><div><UserRoundCheck /><span>03</span><h3>提交归你</h3><p>智能体负责准备与预填；你检查表单并亲自提交。</p></div></div></section>

      <section className="workflow-end"><div><p className="workflow-kicker">开始使用</p><h2>从真实职位开始。</h2><p>进入本地工作台，发现职位、查看评分和追踪进度。</p></div><div className="workflow-end-links"><Link href="/explore">探索职位 <ArrowUpRight size={18} /></Link><Link href="/pipeline">查看投递管线 <ArrowUpRight size={18} /></Link></div></section>
    </div>
  );
}
