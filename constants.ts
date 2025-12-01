import { Curriculum, Module } from './types';

export const UNREAL_CURRICULUM: Curriculum = {
  modules: [
    {
      id: 'm1',
      title: '模块 1: 虚幻引擎 C++ 基础',
      topics: [
        {
          id: 't1-1',
          title: '虚幻基本类型',
          description: '学习 int32, float, FString, FName, 和 FText。',
          promptContext: '请解释虚幻引擎的标准基本类型 (int32, float 等) 以及字符串类 (FString, FName, FText)。解释何时使用哪种字符串类型。'
        },
        {
          id: 't1-2',
          title: '指针与引用',
          description: '在处理 UObject 之前理解内存管理基础。',
          promptContext: '请解释 C++ 中的指针 (*) 和引用 (&)，特别是在虚幻引擎环境下的应用。请提及 nullptr 安全性。'
        },
        {
          id: 't1-3',
          title: '宏与预处理器',
          description: '介绍 check(), verify() 和 UE_LOG 等虚幻宏。',
          promptContext: '请解释如何在虚幻 C++ 中使用 UE_LOG, check(), 和 ensure() 进行调试。'
        }
      ]
    },
    {
      id: 'm2',
      title: '模块 2: 虚幻对象模型',
      topics: [
        {
          id: 't2-1',
          title: 'UObject 与垃圾回收',
          description: '虚幻引擎如何管理内存以及万物之基类。',
          promptContext: '请解释什么是 UObject，反射系统简述，以及垃圾回收 (Garbage Collection) 如何处理 UObject。'
        },
        {
          id: 't2-2',
          title: 'AActor 与 UActorComponent',
          description: '世界的构建块及其模块化组件。',
          promptContext: '请解释 AActor 和 UActorComponent 之间的区别。什么时候应该创建一个新的 Actor，什么时候应该创建一个新的 Component？'
        },
        {
          id: 't2-3',
          title: 'UPROPERTY 说明符',
          description: '向编辑器和蓝图暴露变量。',
          promptContext: '请解释 UPROPERTY 宏。举例说明 EditAnywhere, BlueprintReadWrite, 和 Category 说明符。'
        },
        {
          id: 't2-4',
          title: 'UFUNCTION 说明符',
          description: '向蓝图暴露函数以及 RPC。',
          promptContext: '请解释 UFUNCTION 宏。举例说明 BlueprintCallable 和 BlueprintNativeEvent。'
        }
      ]
    },
    {
      id: 'm3',
      title: '模块 3: 游戏性框架',
      topics: [
        {
          id: 't3-1',
          title: 'GameMode, PlayerController, Pawn',
          description: '定义规则和控制的核心类。',
          promptContext: '请解释虚幻引擎中 GameMode, PlayerController, 和 Pawn/Character 之间的关系。'
        },
        {
          id: 't3-2',
          title: '输入映射 (Enhanced Input)',
          description: '使用新的增强输入系统处理玩家输入。',
          promptContext: '请展示如何在 C++ 中为简单的角色移动设置增强输入 (Enhanced Input)。'
        },
        {
          id: 't3-3',
          title: '碰撞与射线检测',
          description: '检测命中并与世界交互。',
          promptContext: '请解释如何在 C++ 中执行 LineTraceSingleByChannel (射线检测) 并处理 FHitResult。'
        },
        {
          id: 't3-4',
          title: '动态生成 Actor',
          description: '在运行时动态创建对象。',
          promptContext: '请展示使用 GetWorld()->SpawnActor 在世界中动态生成 Actor 的代码。'
        }
      ]
    },
    {
      id: 'm4',
      title: '模块 4: 高级概念',
      topics: [
        {
          id: 't4-1',
          title: '代理与事件分发器',
          description: '对象之间的解耦通信。',
          promptContext: '请解释虚幻代理 (DECLARE_DYNAMIC_MULTICAST_DELEGATE)。如何在 C++ 中绑定它们？'
        },
        {
          id: 't4-2',
          title: '接口 (Interfaces)',
          description: '使用 UInterfaces 实现多态。',
          promptContext: '请解释如何在虚幻 C++ 中定义和实现 UInterface，以允许不相关的类之间进行交互。'
        },
        {
          id: 't4-3',
          title: '定时器与异步',
          description: '处理延迟事件和基本线程概念。',
          promptContext: '请解释如何使用 FTimerManager 调度未来的函数调用。'
        }
      ]
    }
  ]
};

export const SYSTEM_INSTRUCTION = `你是虚幻引擎5 (Unreal Engine 5) C++ 专家导师。
你的目标是教初学者编写整洁、高性能且符合标准的 Unreal C++ 代码。
规则：
1. 始终使用现代 Unreal 编码标准（例如，使用 TArray 而不是 std::vector，FString 而不是 std::string）。
2. 提供代码时，务必使用 markdown 代码块包裹，语言标记为 'cpp'。
3. 解释要简洁完整，适合初学者，必要时使用类比。
4. 如果被问及蓝图，解释 C++ 如何与其关联（例如，通过 UPROPERTY 暴露变量）。
5. 态度鼓励且乐于助人。
6. **请始终使用中文回复**。
`;