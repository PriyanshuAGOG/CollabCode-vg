"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Sparkles } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individual developers and small projects",
      icon: Zap,
      features: [
        "Up to 3 projects",
        "Basic collaboration tools",
        "Community support",
        "Standard templates",
        "5GB storage",
      ],
      cta: "Get Started",
      popular: false,
      gradient: "from-slate-gray to-dark-slate",
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing teams and advanced projects",
      icon: Star,
      features: [
        "Unlimited projects",
        "Advanced AI assistance",
        "Real-time collaboration",
        "Premium templates",
        "100GB storage",
        "Priority support",
        "Custom themes",
        "Advanced analytics",
      ],
      cta: "Start Free Trial",
      popular: true,
      gradient: "from-bright-purple to-bright-cyan",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific requirements",
      icon: Crown,
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "Dedicated support manager",
        "Custom integrations",
        "Advanced security",
        "SLA guarantee",
        "On-premise deployment",
        "Custom training",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-bright-cyan to-soft-purple",
    },
  ]

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-slide-in-up">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-bright-purple text-bright-purple bg-bright-purple/10 text-lg px-4 py-2"
              >
                Transparent Pricing
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-8 leading-tight">
              Choose the perfect plan for
              <br />
              <span className="gradient-text">your development journey</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Start free and scale as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={index}
                    className={`glass-card relative transition-all duration-500 hover:scale-105 animate-slide-in-up ${
                      plan.popular
                        ? "border-bright-purple/40 shadow-purple-glow scale-105"
                        : "border-slate-gray/20 hover:border-slate-gray/40"
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-bright-purple text-white border-0 animate-pulse-glow">Most Popular</Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8">
                      <div
                        className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-purple-glow`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-3xl mb-4 text-text-primary">{plan.name}</CardTitle>
                      <div className="mb-6">
                        <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                        {plan.period && <span className="text-text-muted text-lg">{plan.period}</span>}
                      </div>
                      <p className="text-text-secondary leading-relaxed">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-bright-cyan flex-shrink-0" />
                            <span className="text-text-secondary">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full h-12 font-semibold text-lg ${
                          plan.popular
                            ? "cyber-button text-white animate-pulse-glow"
                            : "border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-slate/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-slide-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-text-secondary">Everything you need to know about our pricing and plans.</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Can I change my plan at any time?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences.",
                },
                {
                  question: "Is there a free trial for paid plans?",
                  answer:
                    "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
                },
                {
                  question: "Do you offer discounts for students or nonprofits?",
                  answer:
                    "Yes, we offer 50% discounts for students and qualified nonprofit organizations. Contact us for more details.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="glass-card animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">{faq.question}</h3>
                    <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
