import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

import { pickProduct, situations, type Pick, type Situation } from "@/content/situations";
import { cn } from "@/lib/utils";

import { BoardFolder, ProductDetail } from "./board-folder";
import { AgentMark, AgentNote, Button, Eyebrow, requestJoin, Section, Wordmark } from "./kit";

type StepId = "ask" | "boards" | "cart" | "you";
type Phase = "user" | "thinking" | "answer";

const flowSteps: { id: StepId; label: string }[] = [
  { id: "ask", label: "Ask" },
  { id: "boards", label: "Boards" },
  { id: "cart", label: "Cart" },
  { id: "you", label: "Profile" },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** productId → pick, across every board. Cart rows use this for lookups. */
const pickById = new Map<string, Pick>(
  situations.flatMap((situation) => situation.picks.map((pick) => [pick.productId, pick])),
);

const tasteRows = [
  { label: "learned", tone: "agent", note: "Muted colors, natural fabrics." },
  { label: "learned", tone: "agent", note: "Sneakers in 9.5 — wide." },
  { label: "noticed", tone: "agent", note: "You skip anything with a big logo." },
  { label: "unsure", tone: "neutral", note: "Watches. Still figuring you out." },
] as const;

const chipClass = (on: boolean) =>
  cn(
    "flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3.5 text-[13px] transition-[border-color,box-shadow,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.98]",
    on
      ? "border-signal font-semibold text-foreground shadow-[0_0_0_0.5px_var(--signal)]"
      : "border-border-strong font-medium text-secondary-foreground hover:border-grey-5",
  );

export function HowItWorks() {
  const [step, setStep] = useState<StepId>("ask");

  // Ask
  const [situation, setSituation] = useState<Situation | null>(null);
  const [phase, setPhase] = useState<Phase>("user");

  // Boards + cart
  const [cart, setCart] = useState<ReadonlySet<string>>(new Set());
  const [detail, setDetail] = useState<{ situation: Situation; index: number } | null>(null);

  // Checkout
  const [paid, setPaid] = useState(false);
  const [doneSteps, setDoneSteps] = useState(0);

  useEffect(() => {
    if (!situation) return;
    if (reducedMotion()) {
      setPhase("answer");
      return;
    }
    setPhase("user");
    const think = setTimeout(() => setPhase("thinking"), 350);
    const answer = setTimeout(() => setPhase("answer"), 1250);
    return () => {
      clearTimeout(think);
      clearTimeout(answer);
    };
  }, [situation]);

  useEffect(() => {
    if (!paid) return;
    if (reducedMotion()) {
      setDoneSteps(3);
      return;
    }
    setDoneSteps(1);
    const pay = setTimeout(() => setDoneSteps(2), 500);
    const ship = setTimeout(() => setDoneSteps(3), 1100);
    return () => {
      clearTimeout(pay);
      clearTimeout(ship);
    };
  }, [paid]);

  const toggleCart = (productId: string) => {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    setPaid(false);
    setDoneSteps(0);
  };

  const cartPicks = [...cart]
    .map((id) => pickById.get(id))
    .filter((pick): pick is Pick => Boolean(pick));
  const total = cartPicks.reduce((sum, pick) => sum + pickProduct(pick).price, 0);
  const storeCount = new Set(cartPicks.map((pick) => pickProduct(pick).store)).size;

  const checkoutSteps = [
    `${storeCount} ${storeCount === 1 ? "store" : "stores"}, one checkout`,
    "Payment handled by apt",
    "Merchants ship — tracking texts you",
  ];

  const answered = phase === "answer";

  // A step is "done" once its outcome exists; the stepper reflects it.
  const stepDone: Record<StepId, boolean> = {
    ask: situation !== null,
    boards: cart.size > 0,
    cart: paid,
    you: false,
  };

  return (
    <Section id="how" className="bg-card">
      <div className="text-center">
        <Eyebrow>
          How <Wordmark className="lowercase! text-[1.35em]!" /> works
        </Eyebrow>
        <h2 className="mx-auto mt-4 max-w-[22ch] text-[clamp(1.5rem,1.15rem+1.6vw,2.75rem)] text-balance leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
          The whole flow, from ask to arrival.
        </h2>
        <p className="mx-auto mt-4 max-w-[54ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] leading-[1.6] text-secondary-foreground">
          Try it: tell your assistant what you're looking for, shape the board, check out once — and
          see what it learns about you along the way.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Flow steps">
        {flowSteps.map((flowStep, index) => (
          <button
            key={flowStep.id}
            type="button"
            onClick={() => setStep(flowStep.id)}
            aria-current={step === flowStep.id ? "step" : undefined}
            className={chipClass(step === flowStep.id)}
          >
            {stepDone[flowStep.id] && step !== flowStep.id ? (
              <>
                <Check size={13} className="text-signal-ink" aria-hidden />
                <span className="sr-only">done,</span>
              </>
            ) : (
              <span className="text-muted-foreground tabular-nums">{index + 1}</span>
            )}
            {flowStep.label}
            {flowStep.id === "cart" && cart.size > 0 ? (
              <span className="text-muted-foreground tabular-nums">({cart.size})</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4 sm:rounded-3xl sm:p-6 lg:p-8">
        {step === "ask" ? (
          <div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Pick a situation">
              {situations.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSituation(option)}
                  aria-pressed={situation?.id === option.id}
                  className={chipClass(situation?.id === option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {!situation ? (
              <p className="mt-6 pb-2 text-[15px] text-muted-foreground">
                Pick one. Your assistant does the rest.
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-4" aria-live="polite">
                <p className="max-w-[36ch] self-end rounded-2xl rounded-br-md bg-sunken px-4 py-2.5 text-[15px] leading-[1.5]">
                  {situation.userLine}
                </p>

                {phase === "thinking" ? (
                  <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <AgentMark size={14} /> apt is thinking…
                  </p>
                ) : null}

                {answered ? (
                  <>
                    <p className="flex max-w-[52ch] items-start gap-2.5 self-start rounded-2xl rounded-bl-md border border-border-agent bg-agent px-4 py-2.5 text-[15px] leading-[1.5] text-agent-foreground">
                      <AgentMark size={16} className="mt-1 shrink-0" />
                      <span>{situation.aptLine}</span>
                    </p>

                    <ul className="grid gap-3 sm:grid-cols-3">
                      {situation.picks.map((pick, index) => {
                        const product = pickProduct(pick);
                        return (
                          <li
                            key={product.id}
                            data-shown={answered}
                            style={{ transitionDelay: `${index * 120}ms` }}
                            className="reveal overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]"
                          >
                            <img
                              src={product.image}
                              alt={product.alt}
                              width={800}
                              height={1066}
                              loading="lazy"
                              className="aspect-[4/3] w-full object-cover"
                            />
                            <div className="p-3 sm:p-4">
                              <p className="text-[14px] font-medium tracking-[-0.012em]">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-[12px] text-muted-foreground tabular-nums">
                                {product.store} · ${product.price}
                              </p>
                              <p className="mt-2 text-[13px] leading-[1.5] text-secondary-foreground">
                                {pick.reason}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <AgentNote label="saved">
                          All three are on your “{situation.board}” board.
                        </AgentNote>
                      </div>
                      <Button
                        variant="agent"
                        className="pulse-ring shrink-0"
                        onClick={() => setStep("boards")}
                      >
                        Open your boards <ArrowRight size={15} aria-hidden />
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {step === "boards" ? (
          <div>
            <p className="text-[15px] text-secondary-foreground">
              Boards hold what your assistant finds. Hover a folder, open a pick, and add what you
              actually want.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {situations.map((option) => (
                <BoardFolder
                  key={option.id}
                  title={option.board}
                  picks={option.picks}
                  cartIds={cart}
                  onSelect={(index) => setDetail({ situation: option, index })}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-[13px] text-muted-foreground">
                Nothing is bought from a board. Carts are for deciding.
              </p>
              <Button
                variant={cart.size > 0 ? "agent" : "outline"}
                className={cn("shrink-0", cart.size > 0 && "pulse-ring")}
                onClick={() => setStep("cart")}
              >
                View cart ({cart.size}) <ArrowRight size={15} aria-hidden />
              </Button>
            </div>
          </div>
        ) : null}

        {step === "cart" ? (
          <div className="mx-auto max-w-xl">
            {cartPicks.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-[15px] text-secondary-foreground">
                  Your cart is empty. Add a pick or two from your boards first.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setStep("boards")}>
                  Back to boards
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex flex-col divide-y divide-border">
                  {cartPicks.map((pick) => {
                    const product = pickProduct(pick);
                    return (
                      <li key={product.id} className="flex items-center gap-3.5 py-3">
                        <img
                          src={product.image}
                          alt={product.alt}
                          width={112}
                          height={112}
                          className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium tracking-[-0.012em]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[13px] text-muted-foreground">
                            {product.store}
                          </p>
                        </div>
                        <p className="text-[15px] text-secondary-foreground tabular-nums">
                          ${product.price}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from cart`}
                          onClick={() => toggleCart(product.id)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sunken hover:text-foreground"
                        >
                          <X size={15} aria-hidden />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-1 flex items-baseline justify-between border-t border-border-strong pt-3">
                  <p className="text-[15px] font-medium">Total</p>
                  <p className="text-[17px] font-semibold tabular-nums">${total}</p>
                </div>

                {!paid ? (
                  <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-[13px] leading-[1.5] text-muted-foreground">
                      One approval. <Wordmark /> handles payments for you.
                    </p>
                    <Button variant="agent" onClick={() => setPaid(true)}>
                      Approve & check out
                    </Button>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-border-strong bg-card p-4 sm:p-5">
                    <ul className="flex flex-col gap-2.5">
                      {checkoutSteps.map((checkoutStep, index) => {
                        const done = index < doneSteps;
                        return (
                          <li
                            key={checkoutStep}
                            className={cn(
                              "flex items-center gap-2.5 text-[14px] transition-colors duration-[240ms]",
                              done ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {done ? (
                              <Check size={15} className="shrink-0 text-signal-ink" aria-hidden />
                            ) : (
                              <span
                                className="h-[15px] w-[15px] shrink-0 rounded-full border border-border-strong"
                                aria-hidden
                              />
                            )}
                            {checkoutStep}
                          </li>
                        );
                      })}
                    </ul>
                    {doneSteps === checkoutSteps.length ? (
                      <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <AgentNote label="learned">
                            Every yes in this cart just sharpened your taste file.
                          </AgentNote>
                        </div>
                        <Button
                          variant="agent"
                          className="pulse-ring shrink-0"
                          onClick={() => setStep("you")}
                        >
                          See your profile <ArrowRight size={15} aria-hidden />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}

        {step === "you" ? (
          <div className="mx-auto max-w-xl">
            <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.012em]">
              <AgentMark size={18} /> Your profile
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Everything <Wordmark className="text-[1.1em]!" /> learns lands here — in the open.
            </p>

            <ul className="mt-3 flex flex-col divide-y divide-border">
              {tasteRows.map((row) => (
                <li key={row.note} className="flex items-baseline gap-3 py-3">
                  <span
                    className={cn(
                      "eyebrow w-20 shrink-0 text-[11px]!",
                      row.tone === "agent" && "text-agent-foreground",
                    )}
                  >
                    {row.label}
                  </span>
                  <span className="text-[15px] leading-[1.45]">{row.note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-secondary-foreground tabular-nums">
              <span>Sizes · M / 9.5</span>
              <span>Budget · $80–$300</span>
              <span>Boards · Snow trip, Dan's birthday, New place</span>
            </div>

            <p className="mt-4 border-t border-border pt-4 text-[13px] leading-[1.5] text-muted-foreground">
              You can read, correct, or erase any of it. Your taste file is yours — it also
              remembers the people you shop for, so gifts stop being guesses.
            </p>

            <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
              <p className="text-[15px] text-secondary-foreground">
                That's the whole loop — ask to arrival.
              </p>
              <Button variant="agent" className="shrink-0" onClick={requestJoin}>
                Join the waitlist <ArrowRight size={15} aria-hidden />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {detail ? (
        <ProductDetail
          pick={detail.situation.picks[detail.index]!}
          inCart={cart.has(detail.situation.picks[detail.index]!.productId)}
          onToggleCart={() => toggleCart(detail.situation.picks[detail.index]!.productId)}
          onClose={() => setDetail(null)}
        />
      ) : null}
    </Section>
  );
}
